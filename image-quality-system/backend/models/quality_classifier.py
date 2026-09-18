import cv2
import numpy as np
from PIL import Image
import io
from typing import Dict, Tuple


class QualityClassifier:
    """
    Image quality classifier that analyzes images based on multiple metrics:
    - Sharpness (Laplacian variance)
    - Brightness levels
    - Contrast ratio
    - Resolution check
    """

    def __init__(self):
        self.min_resolution = (100, 100)
        self.weights = {
            'sharpness': 0.4,
            'brightness': 0.2,
            'contrast': 0.3,
            'resolution': 0.1
        }

    def calculate_sharpness(self, image: np.ndarray) -> float:
        """
        Calculate image sharpness using Laplacian variance.
        Higher values indicate sharper images.
        """
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()

        # Normalize to 0-1 range (typical variance range: 0-1000)
        normalized_score = min(laplacian_var / 1000.0, 1.0)
        return normalized_score

    def calculate_brightness(self, image: np.ndarray) -> float:
        """
        Calculate image brightness score.
        Optimal brightness is around 127 (middle of 0-255 range).
        """
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        mean_brightness = np.mean(gray)

        # Score based on how close to optimal brightness (127)
        # Perfect score at 127, decreases as it moves away
        optimal = 127
        deviation = abs(mean_brightness - optimal) / optimal
        score = max(0, 1 - deviation)

        return score

    def calculate_contrast(self, image: np.ndarray) -> float:
        """
        Calculate image contrast using standard deviation.
        Higher standard deviation indicates better contrast.
        """
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        std_dev = np.std(gray)

        # Normalize to 0-1 range (typical std dev range: 0-80)
        normalized_score = min(std_dev / 80.0, 1.0)
        return normalized_score

    def calculate_resolution_score(self, image: np.ndarray) -> float:
        """
        Calculate resolution score based on image dimensions.
        """
        height, width = image.shape[:2]
        total_pixels = height * width

        # Score based on megapixels
        # 0.5 MP = low, 2 MP = good, 5+ MP = excellent
        megapixels = total_pixels / 1_000_000

        if megapixels < 0.5:
            score = megapixels / 0.5 * 0.5  # 0 to 0.5
        elif megapixels < 2:
            score = 0.5 + (megapixels - 0.5) / 1.5 * 0.3  # 0.5 to 0.8
        else:
            score = min(0.8 + (megapixels - 2) / 3 * 0.2, 1.0)  # 0.8 to 1.0

        return score

    def classify_image(self, image_bytes: bytes) -> Dict:
        """
        Classify image quality and return detailed metrics.

        Returns:
            Dict containing:
            - quality_score: float (0-1)
            - category: str ('bad', 'normal', 'high')
            - metrics: Dict with individual scores
        """
        try:
            # Convert bytes to numpy array
            image = Image.open(io.BytesIO(image_bytes))
            image_np = np.array(image)

            # Convert RGB to BGR for OpenCV
            if len(image_np.shape) == 2:  # Grayscale
                image_bgr = cv2.cvtColor(image_np, cv2.COLOR_GRAY2BGR)
            elif image_np.shape[2] == 4:  # RGBA
                image_bgr = cv2.cvtColor(image_np, cv2.COLOR_RGBA2BGR)
            else:  # RGB
                image_bgr = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)

            # Calculate individual metrics
            sharpness = self.calculate_sharpness(image_bgr)
            brightness = self.calculate_brightness(image_bgr)
            contrast = self.calculate_contrast(image_bgr)
            resolution = self.calculate_resolution_score(image_bgr)

            # Calculate weighted quality score
            quality_score = (
                sharpness * self.weights['sharpness'] +
                brightness * self.weights['brightness'] +
                contrast * self.weights['contrast'] +
                resolution * self.weights['resolution']
            )

            # Determine category
            if quality_score < 0.4:
                category = "bad"
            elif quality_score < 0.7:
                category = "normal"
            else:
                category = "high"

            # Get image dimensions
            height, width = image_bgr.shape[:2]

            return {
                "quality_score": round(quality_score, 3),
                "category": category,
                "metrics": {
                    "sharpness": round(sharpness, 3),
                    "brightness": round(brightness, 3),
                    "contrast": round(contrast, 3),
                    "resolution_score": round(resolution, 3)
                },
                "dimensions": {
                    "width": width,
                    "height": height,
                    "megapixels": round((width * height) / 1_000_000, 2)
                }
            }

        except Exception as e:
            raise ValueError(f"Error processing image: {str(e)}")

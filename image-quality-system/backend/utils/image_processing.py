from typing import Tuple
import io
from PIL import Image


class ImageProcessor:
    """
    Utility class for image processing operations.
    """

    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'}
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

    @staticmethod
    def validate_file_extension(filename: str) -> bool:
        """
        Validate if the file has an allowed extension.
        """
        return '.' in filename and \
            filename.rsplit('.', 1)[1].lower() in ImageProcessor.ALLOWED_EXTENSIONS

    @staticmethod
    def validate_file_size(file_bytes: bytes) -> bool:
        """
        Validate if the file size is within the allowed limit.
        """
        return len(file_bytes) <= ImageProcessor.MAX_FILE_SIZE

    @staticmethod
    def validate_image(file_bytes: bytes, filename: str) -> Tuple[bool, str]:
        """
        Validate image file.

        Returns:
            Tuple[bool, str]: (is_valid, error_message)
        """
        # Check extension
        if not ImageProcessor.validate_file_extension(filename):
            return False, f"Invalid file type. Allowed types: {', '.join(ImageProcessor.ALLOWED_EXTENSIONS)}"

        # Check size
        if not ImageProcessor.validate_file_size(file_bytes):
            max_mb = ImageProcessor.MAX_FILE_SIZE / (1024 * 1024)
            return False, f"File size exceeds {max_mb}MB limit"

        # Try to open as image
        try:
            image = Image.open(io.BytesIO(file_bytes))
            image.verify()  # Verify that it is an image
            return True, ""
        except Exception as e:
            return False, f"Invalid image file: {str(e)}"

    @staticmethod
    def get_image_info(file_bytes: bytes) -> dict:
        """
        Get basic information about the image.
        """
        try:
            image = Image.open(io.BytesIO(file_bytes))
            return {
                "width": image.width,
                "height": image.height,
                "format": image.format,
                "mode": image.mode,
                "size_bytes": len(file_bytes)
            }
        except Exception as e:
            raise ValueError(f"Error reading image: {str(e)}")

from flask import jsonify

class ResponseHelper:

    @staticmethod
    def success(
        message="Success",
        data=None,
        status_code=200
    ):
        response = {
            "success": True,
            "message": message,
            "data": data
        }

        return jsonify(response), status_code

    @staticmethod
    def error(
        message="Error",
        errors=None,
        status_code=400
    ):
        response = {
            "success": False,
            "message": message,
            "errors": errors
        }

        return jsonify(response), status_code
import resend
from flask import current_app


class EmailHelper:

    @staticmethod
    def send_password_reset_email(to_email: str, reset_url: str) -> None:
        resend.api_key = current_app.config["RESEND_API_KEY"]

        resend.Emails.send({
            "from": current_app.config["RESEND_FROM_EMAIL"],
            "to": to_email,
            "subject": "إعادة تعيين كلمة المرور - فرح",
            "html": f"""
                <div dir="rtl" style="font-family: Tahoma, Arial, sans-serif; line-height: 1.6;">
                    <p>مرحبًا،</p>
                    <p>وصلنا طلب لإعادة تعيين كلمة مرور حسابك بمنصة فرح.</p>
                    <p>
                        <a href="{reset_url}"
                           style="display:inline-block;background:#c9a227;color:#fff;
                                  padding:10px 20px;border-radius:6px;text-decoration:none;">
                            إعادة تعيين كلمة المرور
                        </a>
                    </p>
                    <p>هذا الرابط صالح لمدة 30 دقيقة فقط. إذا لم تطلبوا هذا، تجاهلوا الرسالة.</p>
                </div>
            """,
        })

<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; }
        .header { background-color: #059669; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { padding: 20px; }
        .footer { text-align: center; font-size: 12px; color: #999; margin-top: 20px; }
        .btn { display: inline-block; padding: 10px 20px; background-color: #1a1a2e; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to the Ranch!</h1>
        </div>
        <div class="content">
            <p>Hello <strong>{{ $worker->name }}</strong>,</p>
            <p>We are excited to inform you that you have been successfully registered as a worker on our ranch.</p>
            <p><strong>Assignment Details:</strong></p>
            <ul>
                <li><strong>Status:</strong> {{ $worker->status }}</li>
                <li><strong>Primary Task:</strong> {{ $worker->task ?? 'General Duties' }}</li>
            </ul>
            <p>Please visit the ranch for further process and onboarding.</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} hayday Ranch Management System. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

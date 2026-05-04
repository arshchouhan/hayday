<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Session Expired - HayDay</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #D7E3EF 0%, #E9EEF6 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
        }

        .session-expired-container {
            background: white;
            border-radius: 2rem;
            box-shadow: 0 20px 60px rgba(26, 26, 46, 0.15);
            max-width: 480px;
            width: 100%;
            padding: 3rem 2rem;
            text-align: center;
        }

        .icon-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 80px;
            height: 80px;
            background: #D7E3EF;
            border-radius: 50%;
            margin: 0 auto 2rem;
        }

        .icon-wrapper svg {
            width: 40px;
            height: 40px;
            color: #1a1a2e;
        }

        h1 {
            font-size: 1.75rem;
            font-weight: 900;
            color: #1a1a2e;
            margin-bottom: 0.75rem;
            letter-spacing: -0.5px;
        }

        .message {
            font-size: 0.95rem;
            color: #666;
            margin-bottom: 2.5rem;
            line-height: 1.6;
        }

        .subtle-text {
            font-size: 0.85rem;
            color: #999;
            margin-bottom: 2rem;
            font-style: italic;
        }

        .login-button {
            display: inline-block;
            background: #1a1a2e;
            color: white;
            padding: 0.875rem 2rem;
            border-radius: 2rem;
            text-decoration: none;
            font-weight: 800;
            font-size: 0.95rem;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            box-shadow: 0 8px 20px rgba(26, 26, 46, 0.2);
            font-family: inherit;
        }

        .login-button:hover {
            background: black;
            box-shadow: 0 12px 30px rgba(26, 26, 46, 0.3);
            transform: translateY(-2px);
        }

        .login-button:active {
            transform: translateY(0);
        }

        form {
            display: inline !important;
        }

        .footer-text {
            font-size: 0.8rem;
            color: #ccc;
            margin-top: 2rem;
        }

        @media (max-width: 480px) {
            .session-expired-container {
                padding: 2rem 1.5rem;
            }

            h1 {
                font-size: 1.5rem;
            }

            .message {
                font-size: 0.9rem;
            }
        }
    </style>
</head>
<body>
    <div class="session-expired-container">
        <div class="icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
                <path d="M12 2v4"></path>
            </svg>
        </div>

        <h1>Session Expired</h1>
        <p class="message">
            Your session has timed out due to inactivity. For security, we've logged you out. Please log in again to continue managing your farm.
        </p>
        <p class="subtle-text">
            This helps keep your data safe and secure.
        </p>

        <form action="{{ url('/login') }}" method="GET" style="display: inline;">
            <button type="submit" class="login-button">Login Again</button>
        </form>

        <div class="footer-text">
            © 2026 HayDay - Farm Management System
        </div>
    </div>
</body>
</html>

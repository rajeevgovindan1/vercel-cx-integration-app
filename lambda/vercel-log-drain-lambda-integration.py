import json
import os
import urllib3
from datetime import datetime

http = urllib3.PoolManager()

def flatten_json(nested, parent_key='', sep='.'):
    items = []
    for k, v in nested.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else k
        if isinstance(v, dict):
            items.extend(flatten_json(v, new_key, sep=sep).items())
        elif isinstance(v, list):
            items.append((new_key, ','.join(map(str, v))))
        else:
            items.append((new_key, v))
    return dict(items)

def lambda_handler(event, context):
    method = event.get("requestContext", {}).get("http", {}).get("method", "")
    headers = event.get("headers", {}) or {}
    body = event.get("body", "") or ""
    vercel_header = headers.get("x-vercel-verify") or headers.get("X-Vercel-Verify")

    token = headers.get("x-coralogix-token")
    url = headers.get("x-coralogix-url", "https://ingress.cx498.coralogix.com/logs/v1/bulk")
    computer_name = headers.get("x-computer-name", "vercel-log-drain")

    print(">>> Incoming Vercel request")
    print("method:", method)
    print("headers:", json.dumps(headers, indent=2))

    if method == "GET":
        print("GET verification request")
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "text/plain",
                "x-vercel-verify": vercel_header or ""
            },
            "body": "Verified"
        }

    if method == "POST":
        if event.get("isBase64Encoded", False):
            import base64
            body = base64.b64decode(body).decode("utf-8")

        try:
            parsed_data = json.loads(body) if body.strip() else {}
        except Exception as e:
            print("JSON parse error. Treating as verification:", e)
            parsed_data = {}

        if not body.strip() or (isinstance(parsed_data, dict) and not parsed_data):
            print("Handling POST verification (empty or dummy request)")
            return {
                "statusCode": 200,
                "headers": {
                    "Content-Type": "text/plain",
                    "x-vercel-verify": vercel_header or ""
                },
                "body": "Verified"
            }

        if not token:
            print("Missing Coralogix token")
            return {
                "statusCode": 400,
                "body": "Missing x-coralogix-token header"
            }

        # Dynamically derive app/subsystem name from projectName
        project_name = "vercel"  # default
        if isinstance(parsed_data, list) and parsed_data and isinstance(parsed_data[0], dict):
            project_name = parsed_data[0].get("projectName", headers.get("x-app-name", "vercel"))
        elif isinstance(parsed_data, dict):
            project_name = parsed_data.get("projectName", headers.get("x-app-name", "vercel"))
        else:
            project_name = headers.get("x-app-name", "vercel")

        app_name = project_name
        subsystem_name = project_name

        print(f" Using applicationName: {app_name}, subsystemName: {subsystem_name}")
        now = int(datetime.utcnow().timestamp() * 1000)

        if isinstance(parsed_data, list):
            log_entries = [
                {
                    "timestamp": now,
                    "severity": 3,
                    "text": json.dumps(flatten_json(entry))
                }
                for entry in parsed_data if isinstance(entry, dict)
            ]
        else:
            log_entries = [
                {
                    "timestamp": now,
                    "severity": 3,
                    "text": json.dumps(flatten_json(parsed_data))
                }
            ]

        payload = {
            "applicationName": app_name,
            "subsystemName": subsystem_name,
            "computerName": computer_name,
            "logEntries": log_entries
        }

        print("Sending to Coralogix @", url)
        print(json.dumps(payload, indent=2))

        try:
            response = http.request(
                "POST",
                url,
                body=json.dumps(payload),
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {token}"
                }
            )
            print("Coralogix response:", response.status, response.data.decode())
            return {
                "statusCode": 200,
                "body": "Logs forwarded to Coralogix"
            }
        except Exception as e:
            print("Error sending to Coralogix:", e)
            return {
                "statusCode": 500,
                "body": "Error sending logs to Coralogix"
            }

    return {
        "statusCode": 405,
        "body": "Method Not Allowed"
    }

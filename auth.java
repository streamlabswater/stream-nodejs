
if (code \!= null && \!code.isEmpty()) \{
  String stringUrl = "[https://dev-streamlabs.auth.us-east-1.amazoncognito.com/oauth2/token]";
  String type = "application/x-www-form-urlencoded";    String authorization = "Basic NmQwczNyaG5zNmpianZycHBuOG9vODBrZWI6NnEzNmJ2NWljczY4azdjbm82dWFnMWs2NjBjazgzM3YxbDV1ZGltdW5yZmwxZjYzZDI5";
  String body = "\[ \{\n" \+            "    \"key\": \"grant_type\",\n" \+            "    \"value\": \"authorization_code\"\n" \+            "\}, \{\n" \+            "    \"key\": \"client_id\",\n" \+            "    \"value\": \""\+CLIENT_ID\+"\"\n" \+            "\}, \{\n" \+            "    \"key\": \"redirect_uri\",\n" \+            "    \"value\": \""\+CALLBACK\+"\"\n" \+            "\}, \{\n" \+            "    \"key\": \"code\",\n" \+            "    \"value\": \""\+code\+"\"\n" \+            "\} \]";

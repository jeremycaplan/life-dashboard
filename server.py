from http.server import HTTPServer, SimpleHTTPRequestHandler
import webbrowser
import os

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def run_server():
    port = 8080
    server_address = ('', port)
    
    # Change to the directory containing the HTML file
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    httpd = HTTPServer(server_address, CORSRequestHandler)
    print(f"Server running at http://localhost:{port}")
    
    # Open the browser automatically
    webbrowser.open(f'http://localhost:{port}')
    
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()

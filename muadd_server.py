from http.server import BaseHTTPRequestHandler, HTTPServer
import cgi, subprocess, syslog

class PostHandler(BaseHTTPRequestHandler):
	def do_POST(self):
		syslog.syslog("do_POST Enter")
		self.form = cgi.FieldStorage(
			fp=self.rfile,
			headers=self.headers,
			environ={'REQUEST_METHOD': 'POST', 'CONTENT_TYPE': self.headers['Content-Type']}
			)
		self.send_response_only(304)
		self.end_headers()
		self.launchMuadd()
		return

	def launchMuadd(self):
		syslog.syslog("launchMuadd Enter")
		artist_title = ""
		for item in self.form.list:
			if item.name == 'title':
				artist_title = item.value
		syslog.syslog(artist_title)
		ret = subprocess.call(["/usr/local/bin/muadd", artist_title], stdout=subprocess.DEVNULL)
		syslog.syslog("After Subprocess Call. Return value is " + str(ret) )

def main():
	server = HTTPServer(('localhost', 7000), PostHandler)
	server.serve_forever()
main()

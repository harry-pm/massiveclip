import logging
from tornado import escape, ioloop, web, websocket
import os.path

class App(web.Application):
    def __init__(self):
        handlers = [
            (r"/", Main_Handler),
            (r"/home", Main_Handler),
            (r"/firefly", Firefly_Handler)
        ]

        settings = dict(
            template_path = os.path.join(os.path.dirname(__file__), "templates"),
            static_path = os.path.join(os.path.dirname(__file__), "static")
        )

        super(App, self).__init__(handlers, **settings)

class Main_Handler(web.RequestHandler):
    def get(self):
        self.render('homepage.html')

class Firefly_Handler(web.RequestHandler):
    def get(self):
        self.render('firefly.html', script_location = '../static/scripts/firefly.js')
        
def main():
    app = App()
    app.listen(8000)
    print('hi')
    ioloop.IOLoop.current().start()

if __name__ == "__main__":
    main()
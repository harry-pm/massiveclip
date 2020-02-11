import logging
import os
from tornado import escape, ioloop, web, websocket
import os.path
import tornado
from handlers import *

class App(web.Application):
    def __init__(self, db):
        handlers = [
            (r"/", Main_Handler),
            (r"/home", Main_Handler),
            (r"/login", Login_Handler),
            (r"/register", Registration_Handler),
            (r"/logout", Logout_Handler),
            (r"/game", Game_Handler),
            (r"/api/save_snake_score", Save_Snake_Score_Request_Handler),
            (r"/snake", Snake_Handler),
            (r"/chat", Chat_Handler),
            (r"/chatsocket", Chat_Socket_Handler),

        ]
        settings = dict(
            template_path = os.path.join(os.path.dirname(__file__), "templates"),
            static_path = os.path.join(os.path.dirname(__file__), "static"),
            db = db,
            cookie_secret = "__TODO:5",
            login_url = "/login",
        )
        super(App, self).__init__(handlers, **settings)


def main():
    port = int(os.getenv("PORT", 8000))
    app = App(db=db)
    app.listen(port)
    print('hi')
    ioloop.IOLoop.current().start()

if __name__ == "__main__":
    main()
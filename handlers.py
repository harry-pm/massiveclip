import tornado
from tornado import escape, ioloop, web, websocket
from tornado_sqlalchemy import SQLAlchemy, SessionMixin

from models import db, User_And_Score, User_Auth

class BaseHandler(tornado.web.RequestHandler):
    def get_current_user(self):
        return self.get_secure_cookie("user")


class Login_Handler(BaseHandler):
    def get(self):
        self.render('login.html')

    def post(self):
        self.set_secure_cookie("user", self.get_argument("name"))
        self.redirect("/")


class Main_Handler(BaseHandler):
    def get(self):
        if not self.current_user:
            self.redirect("/login")
            return 
        name = tornado.escape.xhtml_escape(self.current_user)
        self.render('homepage.html', name = name)


class Game_Handler(BaseHandler):
    def get(self):
        name = tornado.escape.xhtml_escape(self.current_user)
        self.render('game.html', script_location = '../static/scripts/game.js', name = name)


class Snake_Handler(BaseHandler):
    def get(self):
        name = tornado.escape.xhtml_escape(self.current_user)
        self.render('snake.html', script_location = '../static/scripts/snake.js', name = name)


class Snake_Scores_Request_Handler(SessionMixin, web.RequestHandler):
    def get(self):
        with self.make_session() as session:
            username = self.get_argument("username")
            all_info = session.query(User_And_Score).filter_by(username = username).first()
            self.write(str(all_info.snake_highscore))


class Save_Snake_Score_Request_Handler(SessionMixin, web.RequestHandler):
    def get(self):
        with self.make_session() as session:
            username = self.get_argument("username")
            snake_highscore = self.get_argument("snake_highscore")
            session.add(User_And_Score(username = username, snake_highscore = snake_highscore))
            # TODO: add condition to only save score if it is higher than current highest by that user (upsert rather than insert - fix this in a bit!)
            session.commit()
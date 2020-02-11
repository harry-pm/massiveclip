import tornado
from tornado import escape, ioloop, web, websocket
from tornado_sqlalchemy import SQLAlchemy, SessionMixin
from passlib.hash import pbkdf2_sha256 as sha256 #encodes passwords

from sqlalchemy import func

# from models import db, User_And_Score, User_Auth 
from models import db, User_Auth, Snake_Highscore

class BaseHandler(tornado.web.RequestHandler):
    def get_current_user(self):
        return self.get_secure_cookie("user")


class Login_Handler(SessionMixin, web.RequestHandler):
    def get(self):
        self.render("login.html", login_message = "", register_message = "")

    def post(self):
        username = self.get_argument("username")
        password = self.get_argument("password")

        with self.make_session() as session:
            user_info = session.query(User_Auth).filter_by(username = username).first()
            if user_info:
                if sha256.verify(password, user_info.password):
                    self.set_secure_cookie("user", self.get_argument("username"))
                    self.redirect("/")
            else:
                self.render("login.html", login_message = "Wrong username or password", register_message = "")


class Registration_Handler(SessionMixin, web.RequestHandler):
    def post(self):
        username = self.get_argument("username")
        password = self.get_argument("password")
        hashed_password = sha256.hash(password)

        with self.make_session() as session:
            user_info = session.query(User_Auth).filter_by(username = username).first()
            if user_info:
                self.render("login.html", login_message = "", register_message = "username already exists")
            session.add(User_Auth(username = username, password = hashed_password))
            session.commit()

        self.set_secure_cookie("user", self.get_argument("username"))
        self.redirect("/")


class Logout_Handler(BaseHandler):
    def get(self):
        self.clear_cookie("user")
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


class Snake_Handler(SessionMixin, BaseHandler):
    def get(self):
        name = tornado.escape.xhtml_escape(self.current_user)
        with self.make_session() as session:

            user_highscore_query = session.query(Snake_Highscore).filter_by(username = name).order_by(Snake_Highscore.highscore.desc()).first()
            if user_highscore_query:
                user_highscore = user_highscore_query.highscore
            else:
                user_highscore = "No highscore yet!"

            all_scores = session.query(Snake_Highscore).order_by(Snake_Highscore.highscore.desc()).all()
            if len(all_scores) < 5:
                top_5_scores = all_scores
            else:
                top_5_scores = all_scores[:5]
            top_5 = [(score.highscore, score.username) for score in top_5_scores]

        self.render('snake.html', script_location = '../static/scripts/snake.js', name = name, user_highscore = user_highscore, top_5 = top_5)


class Save_Snake_Score_Request_Handler(SessionMixin, web.RequestHandler):
    def get(self):
        with self.make_session() as session:
            username = self.get_argument("username")
            snake_score = int(self.get_argument("snake_score"))
            session.add(Snake_Highscore(username = username, highscore = snake_score))
            session.commit()
import logging
from tornado import escape, ioloop, web, websocket
import os.path
from tornado_sqlalchemy import SQLAlchemy, SessionMixin
import tornado

######################################################### Models, SQLAlchemy stuff
from sqlalchemy import Column, BigInteger, String, Integer # for use in defining our models

db = SQLAlchemy(url='sqlite:///test.db')

class User_And_Score(db.Model):
    __tablename__ = "user_and_score"
    id = Column(Integer, primary_key = True, autoincrement = True)
    username = Column(String(255))
    snake_highscore = Column(Integer) 
    # N.B think this will need restructuring to a table for each game with those highscores
    # rather than storing a score for each game in each player's table - because what if a new game is added? Whole db needs migrating. Keeping for now for speed.



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

############################# Temporarily building DB models in app.py - will abstract out once they are functioning

class App(web.Application):
    def __init__(self, db):
        handlers = [
            (r"/", Main_Handler),
            (r"/home", Main_Handler),
            (r"/login", Login_Handler),
            (r"/game", Game_Handler),
            (r"/api/snake_scores", Snake_Scores_Request_Handler),
            (r"/api/save_snake_score", Save_Snake_Score_Request_Handler),
            (r"/snake", Snake_Handler)
        ]

        settings = dict(
            template_path = os.path.join(os.path.dirname(__file__), "templates"),
            static_path = os.path.join(os.path.dirname(__file__), "static"),
            db = db,
            cookie_secret = "__TODO:5",
            login_url = "/login",
        )

        super(App, self).__init__(handlers, **settings)

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
        
def main():
    app = App(db=db)
    app.listen(8000)
    print('hi')
    ioloop.IOLoop.current().start()

if __name__ == "__main__":
    main()
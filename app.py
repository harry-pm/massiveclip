import logging
from tornado import escape, ioloop, web, websocket
import os.path
from tornado_sqlalchemy import SQLAlchemy, SessionMixin

######################################################### Models, SQLAlchemy stuff
from sqlalchemy import Column, BigInteger, String # for use in defining our models

db = SQLAlchemy(url='sqlite:///test.db')

class User_And_Score(db.Model):
    __tablename__ = "user_and_score"
    id = Column(BigInteger, primary_key = True)
    username = Column(String(255), unique = True)
    snake_highscore = Column(BigInteger) 
    # N.B think this will need restructuring to a table for each game with those highscores
    # rather than storing a score for each game in each player's table - because what if a new game is added? Whole db needs migrating. Keeping for now for speed.



class Snake_Scores_Request_Handler(SessionMixin, web.RequestHandler):
    def get(self):
        with self.make_session() as session:
            username = self.get_argument("username")
            all_info = session.query(User_And_Score).filter_by(username = username).first()
            string = "Current user: " + all_info.username + ". Current score: " + str(all_info.snake_highscore)
            self.write(string)


############################# Temporarily building DB models in app.py - will abstract out once they are functioning

class App(web.Application):
    def __init__(self, db):
        handlers = [
            (r"/", Main_Handler),
            (r"/home", Main_Handler),
            (r"/game", Game_Handler),
            (r"/snake_scores", Snake_Scores_Request_Handler)
        ]

        settings = dict(
            template_path = os.path.join(os.path.dirname(__file__), "templates"),
            static_path = os.path.join(os.path.dirname(__file__), "static"),
            db = db
        )

        super(App, self).__init__(handlers, **settings)

class Main_Handler(web.RequestHandler):
    def get(self):
        self.render('homepage.html')

class Game_Handler(web.RequestHandler):
    def get(self):
        self.render('game.html')

def main():
    app = App(db=db)
    app.listen(8000)
    print('hi')
    ioloop.IOLoop.current().start()

if __name__ == "__main__":
    main()
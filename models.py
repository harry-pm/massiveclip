from tornado_sqlalchemy import SQLAlchemy, SessionMixin
from sqlalchemy import Column, BigInteger, String, Integer # for use in defining our models
import os

# db_url = os.environ['DATABASE_URL']
db_url = 'postgres://harry:@localhost/games'
# db_url = 'postgres://postgres:@localhost/games'
db = SQLAlchemy(url=db_url)

class Snake_Highscore(db.Model):
    __tablename__ = "snake_highscores"
    id = Column(Integer, primary_key = True, autoincrement = True)
    username = Column(String(100), nullable = False)
    highscore = Column(Integer)


class User_Auth(db.Model):
    __tablename__ = "user_auth"
    id = Column(Integer, primary_key = True, autoincrement = True)
    username = Column(String(100), unique = True, nullable = False)
    password = Column(String(100), nullable = False)

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()
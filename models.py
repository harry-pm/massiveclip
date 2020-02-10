from tornado_sqlalchemy import SQLAlchemy, SessionMixin
from sqlalchemy import Column, BigInteger, String, Integer # for use in defining our models

db = SQLAlchemy(url='sqlite:///test.db')

class User_And_Score(db.Model):
    __tablename__ = "user_and_score"
    id = Column(Integer, primary_key = True, autoincrement = True)
    username = Column(String(100), nullable = False)
    snake_highscore = Column(Integer) 
    # N.B think this will need restructuring to a table for each game with those highscores
    # rather than storing a score for each game in each player's table - because what if a new game is added? Whole db needs migrating. Keeping for now for speed.


class User_Auth(db.Model):
    __tablename__ = "user_auth"
    id = Column(Integer, primary_key = True, autoincrement = True)
    username = Column(String(100), unique = True, nullable = False)
    password = Column(String(100), nullable = False)

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()
from modules.functions import sql
from modules import config

SQLtools = sql.SQL(config.ip_db, config.user, config.password, config.db_name)
SQLtools.query("UPDATE users SET money=money+bad_answers WHERE generator=1")
SQLtools.query("UPDATE users SET good_answers=0, bad_answers=0 WHERE generator=1 OR special=1")

print("ok")

from modules.functions import sql
from modules import config
import time

SQLtools = sql.SQL(config.ip_db, config.user, config.password, config.db_name)

lvl = 1
total_exp = 0
coff = 1.1

generate_lvls = 100


SQLtools.query("DELETE FROM levels")
while lvl <= 100:
    y = round((lvl * 10) ** coff)
    SQLtools.query("INSERT INTO levels (lvl, exp_total, exp_to_lvl) VALUES (%s, %s, %s)", (lvl, total_exp, y))
    print(lvl, total_exp, y)
    total_exp += y
    lvl += 1
    time.sleep(0.2)

SQLtools.query("INSERT INTO levels (lvl, exp_total, exp_to_lvl) VALUES (%s, %s, %s)", (lvl, total_exp, 1000000))


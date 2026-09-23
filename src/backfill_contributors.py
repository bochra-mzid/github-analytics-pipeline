
from database import get_connection

contributors = [
    {"id": 1400464, "login": "scttcper"},
    {"id": 62246304, "login": "ukarpenkov"},
    {"id": 92371686, "login": "dpkass"},
    {"id": 2146436, "login": "kraftwer1"},
    {"id": 61546355, "login": "JMartinCollins"},
    {"id": 174352, "login": "binaryphile"},
    {"id": 38460321, "login": "nguyenvanthanh97"},
    {"id": 4299398, "login": "palerdot"},
]

connection = get_connection()
cursor = connection.cursor()

for contributor in contributors:
    cursor.execute("""
        INSERT INTO contributors (id, login)
        VALUES (%s, %s)
        ON CONFLICT (id)
        DO UPDATE SET
            login = EXCLUDED.login;
    """, (
        contributor["id"],
        contributor["login"]
    ))

connection.commit()
cursor.close()
connection.close()
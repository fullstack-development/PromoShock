import os


def get_memcache_uri():
    host = os.environ.get("MEMCACHE_HOST", "localhost")
    port = 3000 if host == "localhost" else 11211
    return f"{host}:{port}"


def get_postgres_uri():
    host = os.environ.get("DB_HOST", "localhost")
    port = 54321 if host == "localhost" else 5432
    password = os.environ.get("DB_PASSWORD", "abc123")
    user, db_name = "metastream", "metastream"
    return f"postgresql://{user}:{password}@{host}:{port}/{db_name}"


def get_web3_uri():
    uri = os.environ.get("BNB_URI", "https://data-seed-prebsc-2-s2.bnbchain.org:8545")
    return uri

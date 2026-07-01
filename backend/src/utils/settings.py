from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    DB_CONNECTION: str
    SECRETE_KEY: str
    ALGORITHM: str
    TOKEN_EXPIRE_MINUTES: int = 15

settings = Settings()

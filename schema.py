from pydantic import BaseModel,EmailStr,ConfigDict

class Usercreate(BaseModel):
    name:str
    username:EmailStr
    password:str

class Userlog(BaseModel):
    username:EmailStr
    password:str

class Userout(BaseModel):
    id:int
    name:str
    username:EmailStr
    model_config=ConfigDict(from_attribute=True)

class WishlistCreate(BaseModel):
    user_id: int
    place: str

class WishlistOut(BaseModel):
    id: int
    user_id: int
    place: str
    model_config = ConfigDict(from_attributes=True)

class MyAtlasCreate(BaseModel):
    user_id: int
    place: str
    visited:bool=False

class MyAtlasOut(BaseModel):
    id: int
    user_id: int
    place: str
    visited:bool=False
    model_config = ConfigDict(from_attributes=True)
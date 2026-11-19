from fastapi import FastAPI, Depends, HTTPException
from database import engine, Base, SessionLocal, Account, Wishlist, MyAtlas
from sqlalchemy import select
from sqlalchemy.orm import Session
from schema import Usercreate, Userlog, Userout, WishlistCreate, WishlistOut, MyAtlasCreate, MyAtlasOut
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI()

app.add_middleware(
     CORSMiddleware,
    allow_origins=[
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://127.0.0.1:5501",
    "http://localhost:5501"
    ],
     allow_credentials=True,
     allow_headers=["*"],
     allow_methods=["*"], 
)

Base.metadata.create_all(bind=engine)

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/signup",response_model=Userout)
def signup(user:Usercreate,db:Session=Depends(get_db)):
    name=user.name
    email=user.username
    password=user.password

    stm=select(Account).where(Account.username==email)
    result=db.execute(stm).scalar_one_or_none()
    if result:
        raise HTTPException(status_code=400,detail="User Already Exist")
    else:
        new_user=Account(name=name,username=email,password=password)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user

@app.post("/login",response_model=Userout)
def login(user:Userlog,db:Session=Depends(get_db)):
    email=user.username
    password=user.password

    stm=select(Account).where(Account.username==email)
    result=db.execute(stm).scalar_one_or_none()
    if result:
        p_result=result.password
        if p_result==password:
            return result
        else:
            raise HTTPException(status_code=400,detail="Incorrect Password")
    else:
        raise HTTPException(status_code=404,detail="User not fouond")

@app.post("/wishlist", response_model=WishlistOut)
def add_wishlist(item: WishlistCreate, db: Session = Depends(get_db)):
    new_item = Wishlist(user_id=item.user_id, place=item.place)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@app.get("/wishlist/{user_id}", response_model=list[WishlistOut])
def get_wishlist(user_id: int, db: Session = Depends(get_db)):
    return db.query(Wishlist).filter(Wishlist.user_id == user_id).all()

@app.delete("/wishlist/{item_id}")
def delete_wishlist(item_id: int, db: Session = Depends(get_db)):
    item = db.get(Wishlist, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    return {"detail": "Deleted"}


@app.post("/myatlas", response_model=MyAtlasOut)
def add_myatlas(item: MyAtlasCreate, db: Session = Depends(get_db)):
    new_item = MyAtlas(
        user_id=item.user_id,
        place=item.place,
        visited=False
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return new_item


@app.get("/myatlas/{user_id}", response_model=list[MyAtlasOut])
def get_myatlas(user_id: int, db: Session = Depends(get_db)):
    items = db.query(MyAtlas).filter(MyAtlas.user_id == user_id).all()
    return items


@app.put("/myatlas/{item_id}")
def update_myatlas(item_id: int, visited: bool, db: Session = Depends(get_db)):
    item = db.query(MyAtlas).filter(MyAtlas.id == item_id).first()

    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")

    item.visited = visited

    db.commit()

    return {"detail": "Updated"}


@app.delete("/myatlas/{item_id}")
def delete_myatlas(item_id: int, db: Session = Depends(get_db)):
    item = db.query(MyAtlas).filter(MyAtlas.id == item_id).first()

    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")

    db.delete(item)
    db.commit()

    return {"detail": "Deleted"}

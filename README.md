
## Getting Started
### Note:- The Django using python 3.7.7 in virtual environment and the frontend is in Next.js(ReactJS Framework)
### All the required packages are given in requirements.txt file to install all do
```
cd backend
# and
pip install -r requirements.txt
```

### After installing all things make Sure To migrate the 'api' app first
```
cd tradiology
# and
python manage.py makemigrations api
```
### then
```
python manage.py migrate api
```
### then migrate the project
```
python manage.py makemigrations 
```
### then
```
python manage.py migrate 
```

### After all setup, run the Django development server:

```
python manage.py runserver
```
### Then, Install frontend modules:
```
cd frontend
# and
npm i
# or
yarn 
```
### Then, run the Next development server:
```

npm run dev
# or
yarn dev
```

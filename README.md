
# **Catalogs Management Dashboard**

## **Description**
This application provides a dashboard for managing catalogs metadata for Syte's clients.  
Users can **view**, **add**, **update**, and **delete** catalogs and perform various actions like setting a catalog as primary or starting an indexing process.  
It ensures constraints like maintaining only one primary catalog per vertical and supports multi-locale catalogs.

## **Technologies Used**
- **Frontend**: React  
- **Backend**: Nest.js  
- **Database**: MongoDB  
- **Environment Configuration**: `.env` file for MongoDB connection string  

## **Setup Instructions**
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. **Backend Setup (BE - "catalogs-api")**:
   - Navigate to the backend directory:
     ```bash
     cd catalogs-api
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Replace the `MONGO_URI` connection string in the `.env` file.
     ```
     MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>?retryWrites=true&w=majority
     ```
   - Start the backend server:
     ```bash
     npm run start:dev
     ```
3. **Frontend Setup (FE - "catalogs-client")**:
   - Navigate to the frontend directory:
     ```bash
     cd catalogs-client
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the frontend server:
     ```bash
     npm start
     ```

## **Usage Instructions**
1. Start both the backend and frontend servers.
2. Open the application in your browser at [http://localhost:3000](http://localhost:3000) (or the port configured in your frontend).
3. Perform the following operations:
   - **View**: Display all catalogs in the table.
   - **Add**: Add a new catalog by filling in the required fields.
   - **Update**: Update an existing catalog to:
     - Change primary status.
     - Modify locales.
     - Start indexing (updates `indexedAt` timestamp).
   - **Delete**: Delete one or multiple catalogs.

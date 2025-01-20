import odbc from "odbc"
const db ='DRIVER={ODBC Driver 17 for SQL Server};SERVER=DESKTOP-13VOL4T;Integrated Security=true/SSPI;DATABASE=Shiekh;UID=sa;PWD=sa123'
export const connectDB = async () => {
    const connection = await odbc.connect(db);
    if(connection){
        console.log("Connected to SQL Server");
    return connection;
  };
}
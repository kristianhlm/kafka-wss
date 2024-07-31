export default function logger(...data: any): void {
    if (process.env.NODE_ENV != "prod")
        console.log(`[${new Date()}] ` + `${[...data]}`);
  }
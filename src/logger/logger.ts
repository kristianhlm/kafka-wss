export default function logger(...data: any) {
    if (process.env.NODE_ENV != "prod")
        console.log(`[${new Date()}] ` + `${[...data]}`);
  }
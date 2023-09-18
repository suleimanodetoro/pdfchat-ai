import { NextResponse } from "next/server";
// AFter uploading to S3, the file data will be sent to this endpoint via post request
// We will be installing tanstack/react-query library. It makes it easy ot handle queries from local to server endpoints

export async function POST(req: Request,res: Response) {
    const body = await req.json();
    const {file_key, file_name} = body;
    try {
        NextResponse
    } catch (error) {
        return NextResponse.json({error:"internal server error"},{status: 500});
        
    }

}
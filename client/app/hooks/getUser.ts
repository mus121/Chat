import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { cookies } = req;
    const authToken = cookies.authToken;
    const userId = cookies.userid;
    const email = cookies.email;


    res.status(200).json({ authToken, userId, email });
}
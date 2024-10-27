import type { NextRequest } from "next/server";

import general from "@/app/db/UMNTC/Course/general.json";
import honors from "@/app/db/UMNTC/Course/honors.json";
import maps from "@/app/db/UMNTC/subject_uids.json";

export async function GET(req: Request) {
  const searchParams = req.nextUrl.searchParams;
  const deep = searchParams.get("deep") || searchParams.get("depth");
  const req_honors = searchParams.get("honors");

  const res = await process_request();
  return Response.json(res);

  async function process_request() {
    // if requested using uid, no extra work required
    const uid = searchParams.get("uid") || searchParams.get("id");
    if (uid) return get_from_uid(uid);

    // more sophisticated processing if requested using subj/num
    const subj = searchParams.get("subj") || searchParams.get("subject");
    const subjmap = maps[subj?.toUpperCase()]; // undefined if subj is undefined

    if (subjmap) {
      let num = searchParams.get("num") || searchParams.get("number");

      // find course by subj and num
      if (num && !deep) {
        const uid = subjmap[num];
        return get_from_uid(uid);
      }

      // this should still work if course.number becomes type number
      if (!num) {
        num = ":"; // smallest string that compares greater than "9999"
      }

      // find courses by subj and return list up to num
      let lst = [];
      for (const [number, uid] of Object.entries(subjmap)) {
        if (number > num) break;
        lst.push(get_from_uid(uid));
      }
      return lst;
    }

    // invalid request parameters
    return null;
  }

  function get_from_uid(uid: string) {
    // truthy value for honors will use the honors file
    if (req_honors) {
      // search honors file first and fallback to general file
      return honors[uid] || general[uid] || null;
    } else {
      // ignore any honors courses
      return general[uid] || null;
    }
  }
}

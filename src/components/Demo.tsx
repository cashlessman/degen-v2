"use client";

import { useEffect, useCallback, useState } from "react";
import sdk, {
  FrameNotificationDetails,
  type FrameContext,
} from "@farcaster/frame-sdk";


import { Button } from "~/components/ui/Button";
import Link from 'next/link';
import Image from 'next/image';

export default function Demo(
  // { title }: { title?: string } = { title: "demo title" }
) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();

  const [addFrameResult, setAddFrameResult] = useState("");

  // const [addFrameResult, setAddFrameResult] = useState("");
  const [notificationDetails, setNotificationDetails] =
    useState<FrameNotificationDetails | null>(null);
  // const [sendNotificationResult, setSendNotificationResult] = useState("");
  // const [setSendNotificationResult] = useState("");


  useEffect(() => {
    setNotificationDetails(context?.client.notificationDetails ?? null);
  }, [context]);


  useEffect(() => {
    const load = async () => {
      setContext(await sdk.context);
      sdk.actions.ready({});
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  const openUrl = useCallback(() => {
    sdk.actions.openUrl("https://warpcast.com/cashlessman.eth");
  }, []);

  const openWarpcastUrl = useCallback(() => {
    sdk.actions.openUrl(shareUrl);
  }, []);

  const tip = useCallback(() => {
    sdk.actions.openUrl("https://warpcast.com/~/compose");
  }, []);

  const close = useCallback(() => {
    sdk.actions.close();
  }, []);

  const addFrame = useCallback(async () => {
    try {
      setNotificationDetails(null);

      const result = await sdk.actions.addFrame();

      if (result.added) {
        if (result.notificationDetails) {
          setNotificationDetails(result.notificationDetails);
        }
        setAddFrameResult(
          result.notificationDetails
            ? `Added, got notificaton token ${result.notificationDetails.token} and url ${result.notificationDetails.url}`
            : "Added, got no notification details"
        );
      } else {
        setAddFrameResult(`Not added: ${result.reason}`);
      }
    } catch (error) {
      setAddFrameResult(`Error: ${error}`);
    }
  }, []);
////////////////////////////////
  // const sendNotification = useCallback(async () => {
  //   setSendNotificationResult("");
  //   if (!notificationDetails || !context) {
  //     return;
  //   }

  //   try {
  //     const response = await fetch("/api/send-notification", {
  //       method: "POST",
  //       mode: "same-origin",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         fid: context.user.fid,
  //         notificationDetails,
  //       }),
  //     });

  //     if (response.status === 200) {
  //       setSendNotificationResult("Success");
  //       return;
  //     } else if (response.status === 429) {
  //       setSendNotificationResult("Rate limited");
  //       return;
  //     }

  //     const data = await response.text();
  //     setSendNotificationResult(`Error: ${data}`);
  //   } catch (error) {
  //     setSendNotificationResult(`Error: ${error}`);
  //   }
  // }, [context, notificationDetails]);
  ////////////////////////////////////////////////////////////////

  const shareText = encodeURIComponent(
    `Track Your $DEGEN stats \n \nV2 frame by @cashlessman.eth`
);
const shareUrl = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=https://followers-count.vercel.app/frames`;

interface allowancesData {
  snapshot_day: string;
  user_rank: string;
  tip_allowance: string;
  remaining_tip_allowance: string;
  wallet_addresses: string[];
}

interface DegenResponse {
  data: allowancesData[];
  points: string;
  pointsRank: string;
}

const [data, setData] = useState<DegenResponse | null>(null);

const Degen = useCallback(async (fid: string) => {
  try {
    const aroundResponse = await fetch(`/api/degen?fid=${fid}`);
    if (!aroundResponse.ok) {
      throw new Error(`Fid HTTP error! Status: ${aroundResponse.status}`);
    }

    const responseData = await aroundResponse.json();
    if (
      responseData &&
      Array.isArray(responseData.allowancesData) &&
      typeof responseData.points === "string" &&
      typeof responseData.pointsRank === "string"
    ) {
      setData({
        data: responseData.allowancesData,
        points: responseData.points,
        pointsRank: responseData.pointsRank,
      });

    } else {
      throw new Error("Invalid response structure");
    }
  } catch (err) {
    console.error("Error fetching data from warpcast", err);
  }
}, []);


useEffect(() => {
  if (context?.user.fid) {
    Degen(String(context.user.fid));
  }
}, [context?.user.fid]);

const currentDate = new Date().toISOString().split("T")[0]; // Use current date
const formatSnapshotDay = (dateString: string) => {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
  const day = date.getDate().toString().padStart(2, '0');
  return `${day}-${month}`;
};
  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }
  
  if (!context?.user.fid)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="flex flex-col items-center justify-center text-white text-2xl p-4">
        <p className="flex items-center justify-center text-center">
          you need to access this frame from inside a farcaster client
        </p>
        <p className="flex items-center justify-center text-center">
          (click on the logo to open in Warpcast)
        </p>
    
        <div className="flex items-center justify-center p-2 bg-white rounded-lg mt-4">
          <Link href="https://warpcast.com/cashlessman.eth/0x24ae126c" className="shadow-lg shadow-white">
            <Image
              src="https://warpcast.com/og-logo.png"
              alt="warpcast logo"
              width={100}
              height={100}
            />
          </Link>
        </div>
      </div>
    </div>
    
    );


  return (
<div className="w-auto bg-slate-900 text-white h-screen">
<div className="w-auto bg-slate-900 text-white">
{/* <h1 className="text-2xl font-bold text-center mb-4">{title}</h1> */}

  <header className="bg-slate-800 text-white py-3">
      <h1 className="text-2xl font-bold text-sky-400 text-center">$DEGEN Stats</h1>
  </header>

  <div className="bg-[#0206178c] relative p-2">  </div>
 


  <Stats />

  <div className="mt-4">
    {Array.isArray(data?.data) && data?.data.length > 0 ? (
      <Table />
    ) : (
      <Stake/>
    )}
  </div>

  <div className="mt-4 text-base/6 font-semibold">
    <div className="flex flex-row justify-self-center w-full">
      <div
        className="bg-[#8B5CF6] p-3 mt-2 justify-self-center flex-1 text-center"
        onClick={openUrl}
      >
        @cashlessman.eth
      </div>
      <div
        className="bg-[#8B5CF6] p-3 mt-2 ml-2 justify-self-center flex-1 text-center"
        onClick={openWarpcastUrl}
      >
        Share
      </div>
      {Array.isArray(data?.data) && data?.data.length > 0 && (
        <div
          className="bg-[#8B5CF6] p-3 mt-2 ml-2 justify-self-center flex-1 text-center"
          onClick={tip}
        >
          Tip
        </div>
      )}
      
    </div>
  </div>

  <div>
    {/* Placeholder for future functionality */}
    {/* <div className="mt-2 mb-4 text-sm">
      Client fid {context?.client.clientFid},
      {context?.client.added ? " frame added to client," : " frame not added to client,"}
      {notificationDetails ? " notifications enabled" : " notifications disabled"}
    </div> */}

    {/* <div className="mt-0">
      <div className="mb-2 text-sm">
        Add frame result: {addFrameResult}
      </div>
    </div> */}

    {/* <div className="mb-2 text-sm">
      Send notification result: {sendNotificationResult}
    </div>
    <div className="mb-4">
      <Button onClick={sendNotification} disabled={!notificationDetails}>
        Send notification
      </Button>
    </div> */}
    <div className="flex flex-row justify-self-center w-full">

    {/* <div className="bg-[#8B5CF6] p-3 py-0 text-center mt-4 text-base/6 font-semibold flex-1">
      <Button
        className="p-0 m-0 border-none bg-transparent"
        onClick={addFrame}
        disabled={context?.client.added}
      >
        Add frame
      </Button>
    </div> */}

    <div
      className="bg-[#8B5CF6] p-3 text-center mt-4 text-base/6 font-semibold flex-1"
      onClick={close}
    >
      Close Frame
    </div>
    </div>
  </div>
</div>
</div>

  );

  function Stake( ) {
    return (
      <div className="mt-4 text-base/6 font-semibold text-center">Stake Atleast 10,000 $DEGEN to get Allowance

</div>
    );
  }

  function Stats( ) {
    return (
      <div className="flex flex-col w-full h-full bg-[#1e293b] text-white">
      <div className="flex items-center justify-center text-white mt-3">
        <img
          src={context?.user.pfpUrl}
          alt="Profile"
          className="w-11 h-11 rounded-lg mr-4"
        />
        <div className="flex flex-col">
          <span className="flex text-1xl">{context?.user.displayName ?? "Anonymous"}</span>
          <span className="flex text-1xl">@{context?.user.username ?? "unknown"}</span>
        </div>
      </div>
      <div className="flex text-1xl justify-center text-[#38BDf8] mt-1">{currentDate ?? "N/A"}</div>
      <div className="flex flex-row items-center justify-between text-[#885aee] mt-1 px-10">
        <div className="flex text-1xl">Allowance Rank: {data?.data[0]?.user_rank ?? "N/A"}</div>
        <div className="flex text-1xl">Points Rank: {data?.pointsRank ?? "N/A"}</div>

   
        </div>
        <div className="flex flex-col w-full text-[#86e635] mt-2">

        <div className="flex flex-row justify-between px-12">
          <span className="text-1xl">Allowance:</span>
          <span className="text-1xl">{data?.data[0]?.tip_allowance ?? "N/A"}</span>
        </div>

        <div className="flex flex-row justify-between px-12">
<span className="text-1xl">Remaining:</span>
<div className="flex">
  <span className="text-1xl">{data?.data[0]?.remaining_tip_allowance ?? "N/A"} </span>
  <span className="text-1xl ml-1">
{Array.isArray(data?.data) && data?.data.length > 0
  ? `(${((Number(data?.data[0]?.remaining_tip_allowance) / Number(data?.data[0]?.tip_allowance)) * 100).toFixed(1) ?? "N/A"}%)`
  : ""}
</span>

</div>
</div>
        <div className="flex flex-row justify-between px-12 mb-3">
          <span className="text-1xl">Points:</span>
          <span className="text-1xl">{data?.points ?? "0"}</span>

        </div>
        </div>
    </div>
    );
  }

  function Table( ) {
    return (
      <div className="bg-[#1E293B] p-3">
              <h1 className="text-2xl font-bold text-sky-400 text-center">Allowance Tracker</h1>

      <table className="table-auto w-auto bg-slate-700 text-lime-400 text-center mt-3">
      <thead className="sticky top-0 bg-slate-700">
          <tr className="text-white text-violet-400 border-b border-lime-400">
            <th className="px-4 py-2 min-w-[80px]">Date</th>
            <th className="px-4 py-2">Rank</th>
            <th className="px-4 py-2">Allowance</th>
            <th className="px-4 py-2">Unused Allowance</th>
          </tr>
        </thead>
        <tbody>
          <tr className="odd:bg-slate-700 even:bg-slate-600">
            <td className="px-4 py-2">{formatSnapshotDay(data?.data[0]?.snapshot_day ?? "N/A")}</td>
            <td className="px-4 py-2">{data?.data[0]?.user_rank ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[0]?.tip_allowance ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[0]?.remaining_tip_allowance ?? "N/A"}</td>
          </tr>
          <tr className="odd:bg-slate-700 even:bg-slate-600">
            <td className="px-4 py-2">{formatSnapshotDay(data?.data[1]?.snapshot_day ?? "N/A")}</td>
            <td className="px-4 py-2">{data?.data[1]?.user_rank ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[1]?.tip_allowance ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[1]?.remaining_tip_allowance ?? "N/A"}</td>
          </tr>
          <tr className="odd:bg-slate-700 even:bg-slate-600">
            <td className="px-4 py-2">{formatSnapshotDay(data?.data[2]?.snapshot_day ?? "N/A")}</td>
            <td className="px-4 py-2">{data?.data[2]?.user_rank ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[2]?.tip_allowance ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[2]?.remaining_tip_allowance ?? "N/A"}</td>
          </tr>
          <tr className="odd:bg-slate-700 even:bg-slate-600">
            <td className="px-4 py-2">{formatSnapshotDay(data?.data[3]?.snapshot_day ?? "N/A")}</td>
            <td className="px-4 py-2">{data?.data[3]?.user_rank ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[3]?.tip_allowance ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[3]?.remaining_tip_allowance ?? "N/A"}</td>
          </tr>
          <tr className="odd:bg-slate-700 even:bg-slate-600">
            <td className="px-4 py-2">{formatSnapshotDay(data?.data[4]?.snapshot_day ?? "N/A")}</td>
            <td className="px-4 py-2">{data?.data[4]?.user_rank ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[4]?.tip_allowance ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[4]?.remaining_tip_allowance ?? "N/A"}</td>
          </tr>
          <tr className="odd:bg-slate-700 even:bg-slate-600">
            <td className="px-4 py-2">{formatSnapshotDay(data?.data[5]?.snapshot_day ?? "N/A")}</td>
            <td className="px-4 py-2">{data?.data[5]?.user_rank ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[5]?.tip_allowance ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[5]?.remaining_tip_allowance ?? "N/A"}</td>
          </tr>

          <tr className="odd:bg-slate-700 even:bg-slate-600">
            <td className="px-4 py-2">{formatSnapshotDay(data?.data[6]?.snapshot_day ?? "N/A")}</td>
            <td className="px-4 py-2">{data?.data[6]?.user_rank ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[6]?.tip_allowance ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[6]?.remaining_tip_allowance ?? "N/A"}</td>
          </tr>
          <tr className="odd:bg-slate-700 even:bg-slate-600">
            <td className="px-4 py-2">{formatSnapshotDay(data?.data[7]?.snapshot_day ?? "N/A")}</td>
            <td className="px-4 py-2">{data?.data[7]?.user_rank ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[7]?.tip_allowance ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[7]?.remaining_tip_allowance ?? "N/A"}</td>
          </tr>
          <tr className="odd:bg-slate-700 even:bg-slate-600">
            <td className="px-4 py-2">{formatSnapshotDay(data?.data[8]?.snapshot_day ?? "N/A")}</td>
            <td className="px-4 py-2">{data?.data[8]?.user_rank ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[8]?.tip_allowance ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[8]?.remaining_tip_allowance ?? "N/A"}</td>
          </tr>
          <tr className="odd:bg-slate-700 even:bg-slate-600">
            <td className="px-4 py-2">{formatSnapshotDay(data?.data[9]?.snapshot_day ?? "N/A")}</td>
            <td className="px-4 py-2">{data?.data[9]?.user_rank ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[9]?.tip_allowance ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[9]?.remaining_tip_allowance ?? "N/A"}</td>
          </tr>
          <tr className="odd:bg-slate-700 even:bg-slate-600">
            <td className="px-4 py-2">{formatSnapshotDay(data?.data[10]?.snapshot_day ?? "N/A")}</td>
            <td className="px-4 py-2">{data?.data[10]?.user_rank ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[10]?.tip_allowance ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[10]?.remaining_tip_allowance ?? "N/A"}</td>
          </tr>
          <tr className="odd:bg-slate-700 even:bg-slate-600">
            <td className="px-4 py-2">{formatSnapshotDay(data?.data[11]?.snapshot_day ?? "N/A")}</td>
            <td className="px-4 py-2">{data?.data[11]?.user_rank ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[11]?.tip_allowance ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[11]?.remaining_tip_allowance ?? "N/A"}</td>
          </tr>
          <tr className="odd:bg-slate-700 even:bg-slate-600">
            <td className="px-4 py-2">{formatSnapshotDay(data?.data[12]?.snapshot_day ?? "N/A")}</td>
            <td className="px-4 py-2">{data?.data[12]?.user_rank ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[12]?.tip_allowance ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[12]?.remaining_tip_allowance ?? "N/A"}</td>
          </tr>
          <tr className="odd:bg-slate-700 even:bg-slate-600">
            <td className="px-4 py-2">{formatSnapshotDay(data?.data[13]?.snapshot_day ?? "N/A")}</td>
            <td className="px-4 py-2">{data?.data[13]?.user_rank ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[13]?.tip_allowance ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[13]?.remaining_tip_allowance ?? "N/A"}</td>
          </tr>
          <tr className="odd:bg-slate-700 even:bg-slate-600">
            <td className="px-4 py-2">{formatSnapshotDay(data?.data[14]?.snapshot_day ?? "N/A")}</td>
            <td className="px-4 py-2">{data?.data[14]?.user_rank ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[14]?.tip_allowance ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[14]?.remaining_tip_allowance ?? "N/A"}</td>
          </tr>
          <tr className="odd:bg-slate-700 even:bg-slate-600">
            <td className="px-4 py-2">{formatSnapshotDay(data?.data[15]?.snapshot_day ?? "N/A")}</td>
            <td className="px-4 py-2">{data?.data[15]?.user_rank ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[15]?.tip_allowance ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[15]?.remaining_tip_allowance ?? "N/A"}</td>
          </tr>
          <tr className="odd:bg-slate-700 even:bg-slate-600">
            <td className="px-4 py-2">{formatSnapshotDay(data?.data[16]?.snapshot_day ?? "N/A")}</td>
            <td className="px-4 py-2">{data?.data[16]?.user_rank ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[16]?.tip_allowance ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[16]?.remaining_tip_allowance ?? "N/A"}</td>
          </tr>
          <tr className="odd:bg-slate-700 even:bg-slate-600">
            <td className="px-4 py-2">{formatSnapshotDay(data?.data[17]?.snapshot_day ?? "N/A")}</td>
            <td className="px-4 py-2">{data?.data[17]?.user_rank ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[17]?.tip_allowance ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[17]?.remaining_tip_allowance ?? "N/A"}</td>
          </tr>

          <tr className="odd:bg-slate-700 even:bg-slate-600">
            <td className="px-4 py-2">{formatSnapshotDay(data?.data[18]?.snapshot_day ?? "N/A")}</td>
            <td className="px-4 py-2">{data?.data[18]?.user_rank ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[18]?.tip_allowance ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[18]?.remaining_tip_allowance ?? "N/A"}</td>
          </tr>
          <tr className="odd:bg-slate-700 even:bg-slate-600">
            <td className="px-4 py-2">{formatSnapshotDay(data?.data[19]?.snapshot_day ?? "N/A")}</td>
            <td className="px-4 py-2">{data?.data[19]?.user_rank ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[19]?.tip_allowance ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[19]?.remaining_tip_allowance ?? "N/A"}</td>
          </tr>
          <tr className="odd:bg-slate-700 even:bg-slate-600">
            <td className="px-4 py-2">{formatSnapshotDay(data?.data[20]?.snapshot_day ?? "N/A")}</td>
            <td className="px-4 py-2">{data?.data[20]?.user_rank ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[20]?.tip_allowance ?? "N/A"}</td>
            <td className="px-4 py-2">{data?.data[20]?.remaining_tip_allowance ?? "N/A"}</td>
          </tr>

        </tbody>
      </table>
    </div>
    );
  }
}

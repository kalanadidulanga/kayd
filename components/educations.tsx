import React from "react";
import Link from "next/link";

import { Icons } from "./icons";
import { educationsInterface } from "@/config/educations";

interface EducationsCardProps {
  educations: educationsInterface[];
}

export default function Educations({ educations }: EducationsCardProps) {
  return (
    <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] lg:grid-cols-3 static">
      {educations.map((item, id) => (
        // <Link href={item.link} target="_blank" key={id}>
        <div
          key={id}
          className="relative rounded-lg border bg-background p-2 w-full h-full hover:bg-accent hover:text-accent-foreground"
        >
          <Icons.externalLink
            size={35}
            className="absolute bottom-3 right-3 border bg-background rounded-full p-2 cursor-pointer text-muted-foreground "
          />
          <div className="flex h-full flex-col justify-between rounded-md p-6">
            <div className="flex flex-row justify-between">
              <h3 className="font-bold flex space-x-2 items-center">
                <Icons.education size={20} />
                <span>{item.title}</span>
              </h3>
              {/* <Icons.gitBranch size={20} /> */}
            </div>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
              <p className="text-sm text-muted-foreground flex space-x-2 items-center">
                <Icons.location size={15} />
                <span>{item.where}</span>
              </p>
            </div>
          </div>
        </div>
        // </Link>
      ))}
    </div>
  );
}

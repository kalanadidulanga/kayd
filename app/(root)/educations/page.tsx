import Educations from "@/components/educations";
import PageHeader from "@/components/page-header";
import { educations } from "@/config/educations";
import { pagesConfig } from "@/config/pages";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Educations",
  description: "My educational journey and certifications.",
};

const page = () => {
  return (
    <>
      <PageHeader
        title={pagesConfig.educations.title}
        description={pagesConfig.educations.description}
      />
      <Educations educations={educations} />
    </>
  );
};

export default page;

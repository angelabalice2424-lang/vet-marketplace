"use client";

import { useState, useEffect } from "react";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { useParams } from "next/navigation";

export default function BookingPage() {
  const params = useParams();
  const clinicId = params.clinicId as string;
  const [clinicName, setClinicName] = useState("Clínica");

  useEffect(() => {
    // Fetch clinic info
    const fetchClinic = async () => {
      try {
        const response = await fetch(`/api/clinics?id=${clinicId}`);
        const data = await response.json();
        if (data && data[0]) {
          setClinicName(data[0].name);
        }
      } catch (error) {
        console.error("Error fetching clinic:", error);
      }
    };

    fetchClinic();
  }, [clinicId]);

  return (
    <BookingWizard clinicId={clinicId} clinicName={clinicName} />
  );
}

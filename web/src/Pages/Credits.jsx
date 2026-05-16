import React from "react";

export default function Credits() {
  const leader = {
    name: "John Kenneth D. Dignos",
    role: "Project Leader / Lead Developer",
    image: "", //ex: images/users.png
    desc:
      "Served as the overall project leader and primary developer responsible for system architecture, full-stack development (MERN), RFID integration, and overall implementation of the Smart Library System with IoT. Led the technical direction of the project and coordinated tasks among group members to ensure successful completion.",
  };

  const members = [
    {
      name: "Leomar Mascariola",
      role: "Resource Provider / Technical Support",
      image: "",
      desc:
        "Provided essential resources such as the development laptop and technical support. Assisted during testing, debugging, and system evaluation to ensure smooth development workflow.",
    },
    {
      name: "Sophia Mae Valle",
      role: "Financial Manager / Procurement",
      image: "",
      desc:
        "Handled budgeting, financial tracking, and procurement of materials and components needed for both hardware and software development of the system.",
    },
    {
      name: "Liam Russel Bustos",
      role: "Hardware Engineer / IoT Developer",
      image: "",
      desc:
        "Developed and implemented the Arduino-based RFID scanner and ensured hardware-software integration for accurate scanning and communication between devices and system database.",
    },
    {
      name: "King Mojado",
      role: "Hardware Fabrication Specialist",
      image: "",
      desc:
        "Designed and assembled the hardware enclosure, ensuring proper placement and protection of electronic components.",
    },
    {
      name: "Zydrix Navarro",
      role: "Hardware Fabrication Assistant",
      image: "",
      desc:
        "Assisted in constructing the physical enclosure and contributed to assembly and structural adjustments of hardware components.",
    },
    {
      name: "Ressa May Labajo",
      role: "Documentation & Admin Support",
      image: "",
      desc:
        "Managed project documentation, reports, and formal write-ups. Assisted in administrative and financial documentation requirements.",
    },
  ];

  const getImage = (name, image) => {
    return image && image.trim() !== ""
      ? image
      : `https://api.dicebear.com/7.x/initials/svg?seed=${name}`;
  };

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-6">

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-blue-700">
          Developers & Project Credits
        </h1>
        <p className="text-gray-600 mt-2">
          Smart Library System with IoT (BookFlow)
        </p>
        <div className="w-24 h-1 bg-red-500 mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="max-w-3xl mx-auto mb-10">
        <div className="bg-white border border-blue-100 shadow-md rounded-lg overflow-hidden">

          <div className="h-40 bg-blue-100 border-b-4 border-red-500 flex items-center justify-center">
            <img
              src={getImage(leader.name, leader.image)}
              alt={leader.name}
              className="w-24 h-24 rounded-full border-4 border-white shadow-md"
            />
          </div>

          <div className="p-6 text-center">
            <h2 className="text-xl font-bold text-blue-700">
              {leader.name}
            </h2>

            <p className="text-red-500 font-semibold text-sm mt-1">
              {leader.role}
            </p>

            <div className="mt-4 text-left">
              <h3 className="text-sm font-bold text-blue-600 mb-2">
                Contribution Details
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                {leader.desc}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

        {members.map((member, index) => (
          <div
            key={index}
            className="bg-white border border-blue-100 shadow-md rounded-lg overflow-hidden"
          >

            <div className="h-40 bg-blue-100 border-b-4 border-red-500 flex items-center justify-center">
              <img
                src={getImage(member.name, member.image)}
                alt={member.name}
                className="w-24 h-24 rounded-full border-4 border-white shadow-md"
              />
            </div>

            <div className="p-5 border-b border-gray-200">
              <h2 className="text-lg font-bold text-blue-700">
                {member.name}
              </h2>

              <p className="text-sm text-red-500 font-semibold">
                {member.role}
              </p>
            </div>

            <div className="p-5">
              <h3 className="text-sm font-bold text-blue-600 mb-2">
                Contribution Details
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                {member.desc}
              </p>
            </div>

          </div>
        ))}

      </div>

      <div className="text-center mt-12 text-sm text-gray-500">
        BookFlow Smart Library System | BSIT-3A Project (2025–2026)
      </div>

    </div>
  );
}
function generateTripTasks(data) {
  const tasks = [
    { title: "Book transport tickets", category: "booking", completed: false },
    { title: "Book hotel / accommodation", category: "booking", completed: false },
    { title: "Prepare passport or ID", category: "documents", completed: false },
    { title: "Purchase travel insurance", category: "documents", completed: false },
    { title: "Pack clothes", category: "packing", completed: false },
    { title: "Pack chargers and power bank", category: "packing", completed: false },
    { title: "Download offline maps", category: "planning", completed: false },
    { title: "Check weather before leaving", category: "planning", completed: false },
  ];

  if (data.hotelPreference) {
    tasks.push({
      title: `Confirm hotel: ${data.hotelPreference}`,
      category: "hotel",
      completed: false,
    });
  }

  return tasks;
}

module.exports = generateTripTasks;
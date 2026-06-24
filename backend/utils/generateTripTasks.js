/**
 * Generates a default list of trip preparation tasks based on trip data.
 *
 * @param {Object} data - Trip-related data or user preferences.
 * @returns {Array<Object>} List of task objects with title, category, and completion status.
 */
function generateTripTasks(data) {
  // Define core tasks required for almost every trip
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

  // Append conditional tasks based on user's hotel preferences
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
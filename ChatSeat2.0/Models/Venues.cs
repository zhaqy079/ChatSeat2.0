using System;
namespace ChatSeat2._0.Models;

public class Slots {
	public string Date { get; set; } = default!;
    public string Time { get; set; } = default!;
}
public class Venues
	{
		public Venues() { }
		public string Id { get; set; } = default!;
		public string Name { get; set; } = default!;
		public string Location { get; set; } = default!;// May use it for map
		public List<Slots> UpcomingSlots { get; set; } = new();// Holds all available future time slots for this venue.
    //public DateTime? NextSlot { get; set; }// Shows the next upcoming slot at this venue
		
}


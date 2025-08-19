using System;
namespace ChatSeat2._0.Models;

public class Venues
	{
		public Venues() { }
		public string Id { get; set; } = default!;
		public string Name { get; set; } = default!;
		public string Address { get; set; } = default!;
		public DateTime? NextSession { get; set; }
}


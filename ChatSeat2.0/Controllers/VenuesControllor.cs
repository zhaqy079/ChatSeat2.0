using System;
using ChatSeat2._0.Models;
using Microsoft.AspNetCore.Mvc;

namespace ChatSeat2._0.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class VenuesControllor : ControllerBase
	{
		[HttpGet]
        public IActionResult GetVenues()
        {
            var venue = new Venues
            {
                Name = "Campbelltown Library",
                Address = "171 Montacute Rd, Newton SA 5074",
                UpcomingSlots = new List<Slots>
                {
                    new Slots { Date = "Monday", Time = "10:00" },
                    new Slots { Date = "Monday", Time = "11:00" },
                    new Slots { Date = "Tuesday", Time = "10:00" },
                    new Slots { Date = "Wednesday", Time = "10:00" },
                    new Slots { Date = "Thursday", Time = "10:00" }
                }
            };

            return Ok(venue);
        }
    }
}
}


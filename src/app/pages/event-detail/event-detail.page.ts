import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../services/event/event.service';
import { Plugins, CameraResultType } from '@capacitor/core';
const { Camera } = Plugins;



@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {

  public currentEvent: any = {};
  public guestName = '';
  public EventGuestList: Array<any>;
  public guestPicture: string = null;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    const eventId: string = this.route.snapshot.paramMap.get('id');
    // console.log(eventId);
    this.getCurrentEvent(eventId);
    this.eventService
      .getEventGuestList(eventId)
      .get()
      .then(eventListSnapshot => {
        this.EventGuestList = [];
        eventListSnapshot.forEach(snap => {
          this.EventGuestList.push({
            id: snap.id,
            guestName: snap.data().guestName,
          });
          return false;
        });
      });

    }
    getCurrentEvent(eventId:string){
      this.eventService
      .getEventDetail(eventId)
      .get()
      .then(eventSnapshot => {
        this.currentEvent = eventSnapshot.data();
        this.currentEvent.id = eventSnapshot.id;
      });


    }
  addGuest(guestName: string): void {
    this.eventService
      .addGuest(
        guestName,
        this.currentEvent.id,
        this.currentEvent.price,
        this.guestPicture
      )
      .then(() => {
        this.guestName = '';
        this.guestPicture = null;
        this.EventGuestList.push({
          id: this.currentEvent.id,
          guestName: guestName,
        });
        this.getCurrentEvent(this.currentEvent.id)
        console.log(this.currentEvent.revenue)
        
     
      }
      );
  }
  async takePicture(): Promise<void> {
    try {
      const profilePicture = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
      });
      this.guestPicture = profilePicture.base64String.slice(23);
    } catch (error) {
      alert(error);
    }
  }
}

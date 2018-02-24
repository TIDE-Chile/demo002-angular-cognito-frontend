import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { UploadEvent, UploadFile } from 'ngx-file-drop';

// import AWS = require('aws-sdk/global');
import { S3, Config, CognitoIdentityCredentials } from 'aws-sdk';
import { DataService } from '../../services/data.service';
const AWS = require('aws-sdk');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  photos: any;
  evidenceList: {};
  city: any;
  profile:any;
  s3: any;
  items: S3.ListObjectsOutput;
  myMessage: string;
  name = 'none';
  email = 'none';
  sub = 'none';
  myId;
  myFolder = "public";
  userDataSubscription: Subscription;
  userData: boolean;
  isAuthorizedSubscription: Subscription;
  isAuthorized: boolean;
  public files: UploadFile[] = [];
  identityPoolId = 'us-east-1:5c09b7e9-c7f5-40cd-9700-1958384acaef';



  constructor(
    private auth: AuthService,
    private dataService: DataService,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
    
    this.auth.idToken.subscribe((token) => {
      if (token) {
        let payload = token.split('.')[1];
        let jsonPayload = JSON.parse(atob(payload));
        var formatted = JSON.stringify(jsonPayload, null, 4);
        this.myMessage = formatted;
  
        this.name = jsonPayload['name'];
        this.email = jsonPayload['email'];
        this.sub = jsonPayload['sub'];
        this.isAuthorized = true;

        this.dataService.profile()
        .subscribe(d => {
          this.profile = d;
          this.city = this.profile && this.profile.city;
        },
        err => {
          console.log(err);
        })
        
        this.dataService.evidence()
        .subscribe((d:any[]) => {
          this.evidenceList = d.map(e => JSON.stringify(e));
        })


        this.s3Dir(token);

      }
    })
    

    
  }

  saveProfile() {
    this.profile = this.profile || {};
    this.profile.city = this.city
    this.dataService.setProfile(this.profile);
  }

  s3Dir(token) {
    var albumBucketName = 'evidence.images';
    var bucketRegion = 'us-east-1';
    var UserPoolId = 'us-east-1_UDZwdQ2Lw';
    const IdentityPoolId = 'us-east-1:5c09b7e9-c7f5-40cd-9700-1958384acaef';
    

    //POTENTIAL: Region needs to be set if not already set previously elsewhere.
    AWS.config.region = bucketRegion;

      /*
    AWS.config.credentials = new AWS.WebIdentityCredentials({
      RoleArn: 'arn:aws:iam::1234567890:role/WebIdentity',
      WebIdentityToken: 'ABCDEFGHIJKLMNOP', // token from identity service
      RoleSessionName: 'web' // optional name, defaults to web-identity
    }, {
      // optionally provide configuration to apply to the underlying AWS.STS service client
      // if configuration is not provided, then configuration will be pulled from AWS.config
    
      // specify timeout options
      httpOptions: {
        timeout: 100
      }
    });
    */

    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      RoleArn: "arn:aws:iam::287173911746:role/Cognito_TIDEIDPoolAuth_Role",
      IdentityPoolId : IdentityPoolId,
      Logins : {
          // Change the key below according to the specific region your user pool is in.
          'cognito-idp.us-east-1.amazonaws.com/us-east-1_UDZwdQ2Lw' : token
      }
    });



    
    AWS.config.credentials.get((err) => {
      if (!err) {
        this.myId = AWS.config.credentials.identityId;
        console.log("Cognito Identity Id:", this.myId);
      }

      this.myFolder = this.myId;
      // Instantiate aws sdk service objects now that the credentials have been updated.
      this.s3 = new AWS.S3({
        params: {Bucket: 'evidence.images'}
      });

      this.listImages('albums');


    });
    


  }

  listImages(albumName) {
    const albumBucketName = 'evidence.images'
    var albumPhotosKey = `${encodeURIComponent(albumName)}/${this.myFolder}/`;
    //var albumPhotosKey = "/albums/23e4e6e8-a3ce-46b1-ad52-618092bff6d3/"
    this.s3.listObjects({Prefix: albumPhotosKey, Delimiter: '/'}, (err, data) => {
    //this.s3.listObjects({}, (err, data) => {
        if (err) {
        return alert('There was an error viewing your album: ' + err.message);
      }
      // `this` references the AWS.Response instance that represents the response
      // var href = this.request.httpRequest.endpoint.href;
      var href = "https://s3.amazonaws.com/";
      var bucketUrl = href + albumBucketName + '/';

      var photos_tmp = data.Contents.filter((d) => {
        return d.Key !== albumPhotosKey
      })
  
      var uriPromises = photos_tmp.map((photo) => {
        //return this.getImage(photo.Key.replace("us-east-1:23e4e6e8-a3ce-46b1-ad52-618092bff6d3", "test"))
        return this.getImage(photo.Key)
      });

      Promise.all(uriPromises)
      .then((photos) => {
        this.photos = photos;
      })
    });
  }

  getImage(key) {
    return new Promise((resolve, reject) => {
      this.s3.getObject({Key: key}, (err,file) => {
        const uri = "data:image/jpeg;base64," + encode(file.Body);
        resolve(this.sanitizer.bypassSecurityTrustResourceUrl(uri));
      })
  
      function encode(data)
      {
          var str = data.reduce(function(a,b){ return a+String.fromCharCode(b) },'');
          return btoa(str).replace(/.{76}(?=.)/g,'$&\n');
      }
    })
  }
  


  listAlbums() {    
    const albumName = 'albums';
    var albumPhotosKey = `${encodeURIComponent(albumName)}/us-east-1:${encodeURIComponent(this.sub)}/`;

    this.s3.listObjects({ Prefix:albumPhotosKey}, function(err, data) {
      if (err) {
        return alert('There was an error listing your albums: ' + err.message);
      } else {

        var photos = data.Contents.map(function(photo) {
          var photoKey = photo.Key;
          return photoKey;
        });

        var albums = data.CommonPrefixes.map(function(commonPrefix) {
          var prefix = commonPrefix.Prefix;
          var albumName = decodeURIComponent(prefix.replace('/', ''));
          return albumName;
        });
        console.log(photos, albums);
      }
    });
  }

  saveFileToAlbum(albumName, file) {
    this.auth.idToken.subscribe((token) => {
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        RoleArn: "arn:aws:iam::287173911746:role/Cognito_TIDEIDPoolAuth_Role",
        IdentityPoolId : this.identityPoolId,
        Logins : {
            // Change the key below according to the specific region your user pool is in.
            'cognito-idp.us-east-1.amazonaws.com/us-east-1_UDZwdQ2Lw' : token
        }
      });
  
      // Instantiate aws sdk service objects now that the credentials have been updated.
      const s3 = new AWS.S3({
        params: {Bucket: 'evidence.images'}
      });

      var fileName = file.name;
      var albumPhotosKey = `${encodeURIComponent(albumName)}/${this.myFolder}/`;
    
      var photoKey = albumPhotosKey + fileName;
      // var photoKey = fileName;
      s3.upload({
        Key: photoKey,
        Body: file,
        ACL: 'public-read'
      }, (err, data) => {
        if (err) {
          alert('Error uploading the photo.');
          return // alert('There was an error uploading your photo: ', err.message);
        } 
        this.listImages('albums');
        alert('Successfully uploaded photo.');
        
        
        // viewAlbum(albumName);
      });
    })

 
  }

  addPhoto() {
    const filesEl = document.getElementById('file-chooser')
    var files = filesEl['files'];
    if (!files.length) {
      return alert('Please choose a file to upload first.');
    }
    var file = files[0];
    this.saveFileToAlbum('albums', file)
  }

 
  public dropped(event: UploadEvent) {
    this.files = event.files;
    for (const file of event.files) {
      
      file.fileEntry.file(info => {
        this.saveFileToAlbum('albums', info)
        console.log(info);
      });
    }
  }
 
  public fileOver(event){
    console.log(event);
  }
 
  public fileLeave(event){
    console.log(event);
  }

  ngOnDestroy(): void {
  }
}

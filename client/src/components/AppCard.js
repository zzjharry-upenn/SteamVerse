import { useEffect, useState } from 'react';
import { Box, Button, ButtonGroup, Link, Modal } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { NavLink } from 'react-router-dom';

import { formatDuration } from '../helpers/formatter';

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';

const config = require('../config.json');

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function AppCard({ appId, handleClose }) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const [appData, setAppData] = useState({});
  const [systemData, setSystemData] = useState({});
  const [imgURL, setImgURL] = useState('');

  const [barRadar, setBarRadar] = useState(true);

  // TODO (TASK 20): fetch the song specified in songId and based on the fetched album_id also fetch the album data
  // Hint: you need to both fill in the callback and the dependency array (what variable determines the information you need to fetch?)
  // Hint: since the second fetch depends on the information from the first, try nesting the second fetch within the then block of the first (pseudocode is provided)
  useEffect(() => {
    // Hint: here is some pseudocode to guide you
    // fetch(song data, id determined by songId prop)
    //   .then(res => res.json())
    //   .then(resJson => {
    //     set state variable with song dta
    //     fetch(album data, id determined by result in resJson)
    //       .then(res => res.json())
    //       .then(resJson => set state variable with album data)
    //     })
      fetch( `http://${config.server_host}:${config.server_port}/app/${appId}`)
      .then(res => res.json())
      .then(resJson => {
        setAppData(resJson);
        const app_title = encodeURIComponent(resJson.title.trim());
        fetch(`http://${config.server_host}:${config.server_port}/get_img/${app_title}`)
        .then(res => res.json())
        .then(resJson => setImgURL(resJson.img_url));
        });
      fetch( `http://${config.server_host}:${config.server_port}/system/${appId}`)
      .then(res => res.json())
      .then(resJson => {
        setSystemData(resJson);
        });
      
  }, [appId]);

  // const chartData = [
  //   { name: 'Danceability', value: songData.danceability },
  //   { name: 'Energy', value: songData.energy },
  //   { name: 'Valence', value: songData.valence },
  // ];

  // const handleGraphChange = () => {
  //   setBarRadar(!barRadar);
  // };
  // console.log(appData.date_release.substring(0, 10))
  let dateStr = '';
  if (appData && appData.date_release) {
    dateStr = appData.date_release.substring(0, 10);
  }

  let os_systems = '';
  if (systemData && systemData.length >= 1) {
    for (let i = 0; i < systemData.length; i++) {
      if (systemData[i].os_name === 'win') {
        os_systems += 'Windows, ';
      } else if (systemData[i].os_name === 'mac') {
        os_systems += 'Mac, ';
      } else {
        os_systems += 'Linux, ';
      }
      
    }
    os_systems = os_systems.substring(0, os_systems.length - 2)
  }
  dateStr = "Released on: " +dateStr;
//   const styles = theme => ({
//     modalStyle1:{
//       position:'absolute',
//       top:'10%',
//       left:'10%',
//       overflow:'scroll',
//       height:'100%',
//       display:'block'
//     }
//   });
  return (
    <Modal
      open={true}
      onClose={handleClose}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    //   className={styles}
    >
      <Box
        p={3}
        style={{ background: 'white', borderRadius: '16px', border: '2px solid #000', width: 500 }}
      >
    <Card >
      <CardHeader
        action={
        //   <IconButton aria-label="settings">
        //     <MoreVertIcon />
        //   </IconButton>
        <Button onClick={handleClose} style={{ left: '50%', transform: 'translateX(-50%)' }} >
          <CloseIcon />
        </Button>
        }
        title={appData.title}
        subheader={dateStr}
      />
      <CardMedia
        component="img"
        height="300"
        image={imgURL}
        alt="Game Image"
      />
      <CardContent>
      <h2>Rating Statistics</h2>
        <p>Rating: {appData.rating}</p>
        <p>Positive Ratio: {appData.positive_ratio} %</p>
        <p>Number of User Reviews: {appData.user_reviews}</p>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
        <h2>System</h2>
        <p>{os_systems}</p>

        <h2>Pricing & Discount</h2>

        <p>Final Price: $ {appData.price_final}</p>
        <p>Original Price: $ {appData.price_original}</p>
        <p>Discount: {appData.discount} % </p>

        </CardContent>
      </Collapse>
    </Card>


      </Box>
    </Modal>
  );
}



        






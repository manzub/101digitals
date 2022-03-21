import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from 'react-query';
import Loading from "../components/Loading";
import Notice from "../components/Notice";
import { sessionId } from "../helpers/helpers";
import backendApi from "../utils/backendApi";
import Content from "./Content";
import { socket } from "./socket";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }

  dissmissComponent() {
    window.location.reload();
  }

  render() {
    if(this.state.hasError) {
      return (<Notice title="Error" message="Something went wrong!." actionText="Dismiss" actionClicked={this.dissmissComponent} />)
    }

    return this.props.children;
  }
}


function App() {
  const app = useSelector(state => state.app);
  const dispatch = useDispatch();

  const [connected, setConnected] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const services = useQuery('services', () => {
    return backendApi.getServices();
  }, { onSuccess: function(data) {
    if(data.status === 1) {
      dispatch({ type: 'LOADED', payload: { services: data.services } })
    }
  } })

  useEffect(() => {
    const myroomId = sessionId(); 
    const eventHandler = () => setConnected(!connected);
    socket.emit('connect-client', myroomId);

    socket.on('messages', (messages) => {
      dispatch({ type: 'SOCKET', payload: socket })
      dispatch({ type: 'MESSAGES', payload: messages })
      eventHandler();
    });
    socket.on('refresh-user', (transactions, notifications) => {
      // dispatch({ type: 'REFRESH-USER', payload: { transactions, notifications } })
    })
    return () => socket.off('messages', eventHandler);
  }, [])
  
  // useEffect(() => {
  //   if(!app.loaded) {
  //     backendApi.getServices().then(response => {
  //       if(response.status === 1) {
  //         return dispatch({ type: 'LOADED', payload: { services: response.services } });
  //       }
  //     })
  //   }
  // }, [dispatch, app])


  return (<div style={{fontFamily:'Montserrat'}} className='bg-white dark:bg-gray-700 transition-all min-h-screen'>
    {/* add loading and content widget */}
    { app.loaded ? <Content /> : <Loading/>}
  </div>);
}

export default App;

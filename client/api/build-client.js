import axios from 'axios';

export default function buildClient({ req }) {
  if (typeof window === 'undefined') {
    console.log('server!!!!');
    // We are on server!
    // request should be made inside the cluster
    // from service to ingress-nginx
    // 'http://SERVICENAME.NAMESPACE.svc.cluster.local'

    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    //We are on browser!
    // browser will add domain to our request and all headers

    return axios.create({
      baseURL: '/',
    });
  }
}

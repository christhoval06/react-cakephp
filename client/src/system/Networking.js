export function ip2long(ip) {
  var ipl=0
  ip.split('.').forEach(function( octet ) {
    ipl<<=8;
    ipl+=parseInt(octet, 10);
  })
  return(ipl >>>0)
};

export function long2ip(ipl) {
  return ( (ipl>>>24) +'.' +
    ((ipl>>16) & 255) +'.' +
    ((ipl>>8) & 255) +'.' +
    (ipl & 255) );
};

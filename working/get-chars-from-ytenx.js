import 'https://better-js.fenz.land/index.js';
import Args from 'https://dragonfly.fenz.land/utils/Args.js';

globalThis.z= ( x, ...a )=> (console.log( x, ...a, new Error().stack.split( /(?=\n)/, )[2], ), x);
globalThis.d= ( x, ...a )=> (console.log( x, ...a, ), Deno.exit());

const args= new Args( ...Deno.args, );

// fix
args.script= args.params.shift();

if( !args.params[0] )
	console.error( '請輸入一個漢字作爲聲母或韻母', );
else
{
	const char= args.params[0];
	const type= (
		args.hasOption( 'c', )
		||
		args.hasOption( 'cjeng', )
	)? 'cjeng': 'yonhmiuk';
	
	const dict= [];
	
	(async ()=> {
		const html= await (await fetch( `http://ytenx.org/kyonh/${type}/${char}/`, )).text();
		
		const sieuxGReg= /<a href="\/kyonh\/sieux\/\d+\/">.<\/a>/g;
		const sieuxReg= /<a href="\/kyonh\/sieux\/(\d+)\/">.<\/a>/;
		const sieuxes= html.match( sieuxGReg, ).map( tag=> tag.matchGroup( sieuxReg, 1, ), );
		
		await Promise.all( sieuxes.map( async sieux=> {
			const html= await (await fetch( `http://ytenx.org/kyonh/sieux/${sieux}/`, )).text();
			
			const dzihGReg= /<a href="\/kyonh\/dzih\/\d+\/">.<\/a>/g;
			const dzihReg= /<a href="\/kyonh\/dzih\/\d+\/">(.)<\/a>/;
			const dzihs= html.match( dzihGReg, ).map( tag=> tag.matchGroup( dzihReg, 1, ), );
			
			dict.push( ...dzihs, );
		}, ), );
		
		console.log( dict.implode(), );
	})();
}

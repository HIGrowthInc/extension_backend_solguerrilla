// import { ethers } from 'ethers';
// import { BetContract, provider } from '../utils/constants';

// async function main() {
//     const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);
//     const betContract = BetContract;


//     // const tx = await betContract.connect(signer).createBattle(
//     //     1661544024,
//     //     1661630424,
//     //     '0x5E8569023518E3B88304df25329a4DA4f59F1124',
//     //     '0x036D48B9d40758EaA075482fFfa58D1cE3F90bD0'
//     // )
//     // console.log(tx);
//     // await tx.wait();
//     const tx = await betContract.connect(signer).stakeNftA(
//         3,
//         [138, 127, 126, 125],
//     );
//     console.log(tx);
//     await tx.wait();
// }

// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main().catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
//   });

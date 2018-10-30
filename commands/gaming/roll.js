const commando = require('discord.js-commando');

function diceValidation ( dice ) {
    const diceRegEx = RegExp( '^[0-9]{0,2}[dD][0-9]{1,2}([-+][0-9]{1,2}|)$' );
    return diceRegEx.test( dice );
}

function parseDice ( input ) {
    let dIndex = input.indexOf('d');
    let minusIndex = input.indexOf('-');
    let plusIndex = input.indexOf('+');
    let numberOfDice = 0;
    let typeOfDice = 0;
    let modifier = 0;

    if (dIndex != 0) {
        numberOfDice = parseInt(input.substring(0,dIndex),10);
    } else {
        numberOfDice = 1;
    }

    if (minusIndex !== -1) {
        modifier = parseInt(input.substring(minusIndex),10);
        typeOfDice = parseInt(input.substring(dIndex+1,minusIndex),10);
    } else if (plusIndex !== -1) {
        modifier = parseInt(input.substring(plusIndex),10);
        typeOfDice = parseInt(input.substring(dIndex+1,plusIndex),10);
    } else {
        modifier = 0;
        typeOfDice = parseInt(input.substring(dIndex+1),10);
    }

    return [numberOfDice,typeOfDice,modifier];

}

module.exports = class roll extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'roll',
            aliases: [],
            group: 'gaming',
            memberName: 'roll',
            description: 'Rolls a dice.',
            details: `You can specify a number of times to roll any dice with modifier. If you want to use a modifier, you must also specify a dice.`,
            examples: ['roll (rolls a single d20 with no modifier)\nroll 2d6\nroll d00 (rolls a single percentile)\nroll d6+5 (+5 modifier)\nroll 3d8-4 (-4 modifier)'],
            guildOnly: false,

            args: [
                {
                    key: 'dice',
                    label: 'dice',
                    prompt: 'What type of dice do you want to roll?',
                    type: 'string',
                    infinite: false,
                    validate: diceValidation,
                    error: "Please respond with a proper type of dice.",
                    default: "d20",
                },
            ]
        });
    }

    async run(message, args) {
        let totalValue = 0;
        let rollList = "";
        var [numberOfDice, typeOfDice, modifier] = parseDice(args.dice);
        let builtMessage = "";

        for (let i = 0; i < numberOfDice; i++) {
            let maxRollRange = 0;
            if (typeOfDice === 0) {
                maxRollRange = 10;
            } else {
                maxRollRange = typeOfDice;
            }
            let minRollRange = 1;
            let roll = Math.floor(Math.random() * (maxRollRange - minRollRange + 1)) + minRollRange;
            if ( typeOfDice === 0 ) {
                roll *= 10;
            }
            roll += modifier;
            totalValue += roll;
            rollList += `${String(roll)} `
        }

        if ( numberOfDice === 1 ) {
            builtMessage = `You rolled ${totalValue}`;
        } else {
            builtMessage = `\nYour total is ${totalValue}`
            builtMessage += `\nYour rolls: ${rollList}`
        }

        message.reply(builtMessage)
    }
};
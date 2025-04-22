import net from 'net';

/**
 * Checks if a port is available
 * @param {number} port - The port to check
 * @returns {Promise<boolean>} - True if the port is available, false otherwise
 */
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false);
      } else {
        // Other errors might indicate the port is not usable for other reasons
        resolve(false);
      }
    });
    
    server.once('listening', () => {
      // Close the server and resolve with true (port is available)
      server.close(() => {
        resolve(true);
      });
    });
    
    server.listen(port, 'localhost');
  });
}

/**
 * Finds an available port starting from the specified port
 * @param {number} startPort - The port to start checking from
 * @returns {Promise<number>} - An available port
 */
async function findAvailablePort(startPort = 3000) {
  let port = startPort;
  
  while (!(await isPortAvailable(port))) {
    console.log(`Port ${port} is in use, trying ${port + 1}...`);
    port++;
    
    // Prevent infinite loops
    if (port > startPort + 1000) {
      throw new Error('Could not find an available port after 1000 attempts');
    }
  }
  
  return port;
}

// Main function
async function main() {
  try {
    // Try the default port first
    const defaultPort = 5000;
    console.log(`Checking if port ${defaultPort} is available...`);
    
    const isDefaultPortAvailable = await isPortAvailable(defaultPort);
    
    if (isDefaultPortAvailable) {
      console.log(`✅ Port ${defaultPort} is available`);
      console.log(`Recommended server configuration: server.listen(${defaultPort}, 'localhost')`);
    } else {
      console.log(`❌ Port ${defaultPort} is in use`);
      
      // Find an available port
      const availablePort = await findAvailablePort(3000);
      console.log(`✅ Found available port: ${availablePort}`);
      console.log(`Recommended server configuration: server.listen(${availablePort}, 'localhost')`);
      
      console.log('\nTo use this port, update your server configuration in server/index.ts:');
      console.log(`const port = ${availablePort};`);
    }
  } catch (error) {
    console.error('Error finding available port:', error.message);
  }
}

main();

import json
import shutil
from ansible.module_utils.common.collections import ImmutableDict
from ansible.parsing.dataloader import DataLoader
from ansible.vars.manager import VariableManager
from ansible.inventory.manager import InventoryManager
from ansible.playbook.play import Play
from ansible.executor.task_queue_manager import TaskQueueManager
from ansible.plugins.callback import CallbackBase
from ansible import context
import ansible.constants as C


class ResultCallback(CallbackBase):
    """A sample callback plugin used for performing an action as results come in

    If you want to collect all results into a single object for processing at
    the end of the execution, look into utilizing the ``json`` callback plugin
    or writing your own custom callback plugin
    """
    def v2_runner_on_ok(self, result, **kwargs):
        """Print a json representation of the result

        This method could store the result in an instance attribute for retrieval later
        """
        host = result._host
        print(json.dumps({host.name: result._result}, indent=4))


# context.CLIARGS = ImmutableDict(connection='local', module_path=['/to/mymodules'], forks=10, become=None,
#                                 become_method=None, become_user=None, check=False, diff=False)

loader = DataLoader() 
passwords = dict(vault_pass='secret')
results_callback = ResultCallback()

inventory = InventoryManager(loader=loader, sources='localhost,')

variable_manager = VariableManager(loader=loader, inventory=inventory)


def launch_vm(vm_name):
    play_source = dict(
                    hosts='localhost',
                    gather_facts='no',
                    tasks=[
                        dict(ec2=dict(region="us-east-2",
                                      key_name="main_pub",
                                      group="launch-wizard-1",
                                      instance_type="t2.micro",
                                      image="ami-0d5d9d301c853a04a",
                                      wait=True,
                                      exact_count=1,
                                      instance_tags=dict(Name=vm_name)
                                      ),
                             register="ec2"
                             )
                    ]
                        )
    play = Play().load(play_source, variable_manager=variable_manager,
                       loader=loader)
    
    tqm = None
    try:
        tqm = TaskQueueManager(
                inventory=inventory,
                variable_manager=variable_manager,
                loader=loader,
                passwords=passwords,
                stdout_callback=results_callback
            )
        result = tqm.run(play) 
    finally:
        if tqm is not None:
            tqm.cleanup()
        shutil.rmtree(C.DEFAULT_LOCAL_TMP, True)
    return result
